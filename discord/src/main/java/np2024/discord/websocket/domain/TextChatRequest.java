package np2024.discord.websocket.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TextChatRequest {
    private String senderName;
    private String content;
}
