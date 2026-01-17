package com.famoney.api.member.dto;

import com.famoney.api.member.entity.Member;
import com.famoney.api.member.entity.MemberRole;
import com.famoney.api.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for member data.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {

    private String id;
    private UserSummary user;
    private MemberRole role;
    private LocalDateTime joinedAt;

    /**
     * Create MemberResponse from Member entity and User entity.
     */
    public static MemberResponse from(Member member, User user) {
        return MemberResponse.builder()
                .id(member.getId())
                .user(UserSummary.from(user))
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    /**
     * Nested class for user summary information.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserSummary {
        private String id;
        private String email;
        private String name;
        private String profileImage;

        public static UserSummary from(User user) {
            return UserSummary.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .name(user.getName())
                    .profileImage(user.getProfileImage())
                    .build();
        }
    }
}
