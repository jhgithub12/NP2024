package np2024.discord.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import np2024.discord.domain.TextChatMessage;
import np2024.discord.validation.ExistChannel;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

@Validated
@Controller
@RequiredArgsConstructor
public class TextChatController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/channels/{channelId}/messages")
    public void deliverMessage(@DestinationVariable @ExistChannel Long channelId,
                                          @Payload @Valid TextChatMessage message) {
        messagingTemplate.convertAndSend("/topic/channels/" + channelId, message);
    }
}
