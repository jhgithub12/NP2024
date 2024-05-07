package np2024.discord.websocket.controller;

import np2024.discord.websocket.domain.TextChatRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TextChatController {
    @MessageMapping("/messages")
    @SendTo("/topic/chat")
    public TextChatRequest textChat(TextChatRequest request) {
        return request;
    }
}
