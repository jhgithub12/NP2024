package np2024.discord.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import np2024.discord.domain.Channel;
import np2024.discord.dto.ChannelRequestDto;
import np2024.discord.dto.ChannelResponseDto;
import np2024.discord.repository.ChannelRepository;
import np2024.discord.validation.ExistChannel;
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
    public void update(@PathVariable @ExistChannel Long channelId,
                       @RequestBody @Valid ChannelRequestDto request) {
        channelRepository.update(channelId, request);
    }

    @DeleteMapping("/{channelId}")
    public void delete(@PathVariable @ExistChannel Long channelId) {
        channelRepository.delete(channelId);
    }
}
