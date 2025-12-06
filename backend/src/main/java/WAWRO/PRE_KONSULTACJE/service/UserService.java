package WAWRO.PRE_KONSULTACJE.service;

import WAWRO.PRE_KONSULTACJE.mapper.UserMapper;
import WAWRO.PRE_KONSULTACJE.model.dto.UserFullDTO;
import WAWRO.PRE_KONSULTACJE.model.entity.User;
import WAWRO.PRE_KONSULTACJE.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserFullDTO getUserById(long userId) {
        User user = userRepository.findByIdOrThrow(userId);
        return userMapper.toDto(user);
    }

    //todo get user from token
    public User getLoggedUser() {
        return userRepository.getByEmail("testowy@test.pl");
    }
}
