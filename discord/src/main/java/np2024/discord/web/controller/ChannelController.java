package np2024.discord.web.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import np2024.discord.web.domain.Channel;
import np2024.discord.web.dto.ChannelRequestDto;
import np2024.discord.web.dto.ChannelResponseDto;
import np2024.discord.web.repository.ChannelRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channels")
@RequiredArgsConstructor
public class ChannelController {

    private final ChannelRepository channelRepository;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChannelResponseDto create(@RequestBody @Valid ChannelRequestDto request){
        Channel channel = channelRepository.save(request);
        return new ChannelResponseDto(channel.getId());
    }

    @GetMapping
    public List<Channel> getAll() {
        return channelRepository.findAll();
    }

    @PatchMapping("/{channelId}")
    public void update(@PathVariable @NotNull Long channelId,
                       @RequestBody @Valid ChannelRequestDto request) {
        channelRepository.update(channelId, request);
    }

    @DeleteMapping("/{channelId}")
    public void delete(@PathVariable @NotNull Long channelId) {
        channelRepository.delete(channelId);
    }
}
