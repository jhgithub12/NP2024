package np2024.discord.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import np2024.discord.domain.TextChatMessage;
import np2024.discord.validation.ExistChannel;
import org.json.simple.JSONObject;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;

@Validated
@Controller
@RequiredArgsConstructor
public class ChattingController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/channels/{channelId}/text/messages")
    public void deliverMessage(@DestinationVariable @ExistChannel Long channelId,
                                          @Payload @Valid TextChatMessage message) {
//        MessageResponseDto responseDto = new MessageResponseDto(message.getUsername(), message.getContent(), MessageType.CHAT);
//        messagingTemplate.convertAndSend("/topic/channels/" + channelId, responseDto);
        messagingTemplate.convertAndSend("/topic/channels/" + channelId + "/text", message);
    }

    /**
     * 새로운 사용자가 비디오 채널에 입장 시
     * 해당 채널의 구독자들에게 자신의 이름 전송
     * @param username
     */
    @MessageMapping("/channels/{channelId}/video/entrance")
    @SendTo("/topic/channels/{channelId}/video")
    public String joinVideoChannel(@Payload @NotBlank String username) {
        return username;
    }

    @MessageMapping("/video/caller/offer")
    @SendTo("/topic/video/caller/offer")
    public JSONObject deliverOffer(JSONObject ob) {
        return ob;
    }

    @MessageMapping("/video/callee/answer")
    @SendTo("/topic/video/callee/answer")
    public JSONObject deliverAnswer(JSONObject ob) {
        return ob;
    }

}
