package np2024.discord.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import np2024.discord.domain.TextChatMessage;
import np2024.discord.dto.VideoRequestDto.JoinDto;
import np2024.discord.validation.ExistChannel;
import org.json.simple.JSONObject;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

@Slf4j
@Validated
@Controller
@RequiredArgsConstructor
public class ChattingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/channels/{channelId}/text/messages")
    @SendTo("/topic/channels/{channelId}/text")
    public TextChatMessage deliverMessage(@DestinationVariable @ExistChannel Long channelId,
                                          @Payload @Valid TextChatMessage message) {
//        MessageResponseDto responseDto = new MessageResponseDto(message.getUsername(), message.getContent(), MessageType.CHAT);
//        messagingTemplate.convertAndSend("/topic/channels/" + channelId, responseDto);
        log.info("[TextChat-Message] channelId: {}, sender: {}", channelId, message.getUsername());
        return message;
    }

    /**
     * 새로운 사용자가 비디오 채널에 입장 시
     * 해당 채널의 구독자들에게 자신의 이름 전송
     */
    @MessageMapping("/channels/{channelId}/video/entrance")
    @SendTo("/topic/channels/{channelId}/video")
    public JoinDto joinVideoChannel(@DestinationVariable @ExistChannel Long channelId,
                                    @Payload @Valid JoinDto request) {
        log.info("[VideoChat-Entrance] channelId: {}, sender: {}", channelId, request.getUsername());
        return request;
    }

    @MessageMapping("/offer")
    public void deliverOffer(@Payload JSONObject ob) {
        log.info("[VideoChat-Offer]: {} -> {}", ob.get("sender"), ob.get("receiver"));
        messagingTemplate.convertAndSend("/topic/offer/" + ob.get("receiver"), ob);
    }

    @MessageMapping("/answer")
    public void deliverAnswer(@Payload JSONObject ob) {
        log.info("[VideoChat-Answer]: {} -> {}", ob.get("sender"), ob.get("receiver"));
        messagingTemplate.convertAndSend("/topic/answer/" + ob.get("receiver"), ob);
    }

}
