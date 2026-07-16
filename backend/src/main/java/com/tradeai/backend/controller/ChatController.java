package com.tradeai.backend.controller;

import com.tradeai.backend.dto.ChatMessageDto;
import com.tradeai.backend.entity.ChatMessage;
import com.tradeai.backend.entity.User;
import com.tradeai.backend.repository.ChatMessageRepository;
import com.tradeai.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // WebSockets message sending mapping
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageDto messageDto) {
        User sender = userRepository.findById(messageDto.getSenderId()).orElse(null);
        User receiver = userRepository.findById(messageDto.getReceiverId()).orElse(null);

        if (sender != null && receiver != null) {
            ChatMessage chatMessage = ChatMessage.builder()
                    .sender(sender)
                    .receiver(receiver)
                    .content(messageDto.getContent())
                    .read(false)
                    .build();

            ChatMessage saved = chatMessageRepository.save(chatMessage);
            
            ChatMessageDto outDto = ChatMessageDto.builder()
                    .id(saved.getId())
                    .senderId(saved.getSender().getId())
                    .receiverId(saved.getReceiver().getId())
                    .content(saved.getContent())
                    .sentAt(saved.getSentAt())
                    .read(saved.getRead())
                    .build();

            // Send to simple broker channel
            messagingTemplate.convertAndSend("/topic/messages/" + outDto.getReceiverId(), outDto);
            messagingTemplate.convertAndSend("/topic/messages/" + outDto.getSenderId(), outDto);
        }
    }

    // REST endpoint to load chat history
    @GetMapping("/api/chat/history/{partnerId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable Long partnerId) {
        User user = getAuthenticatedUser();
        List<ChatMessage> history = chatMessageRepository.findChatHistory(user.getId(), partnerId);

        List<ChatMessageDto> dtos = history.stream().map(m -> ChatMessageDto.builder()
                .id(m.getId())
                .senderId(m.getSender().getId())
                .receiverId(m.getReceiver().getId())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .read(m.getRead())
                .build()).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
