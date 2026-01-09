package com.famoney.api.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FieldError {
    private final String field;
    private final String message;

    public static FieldError of(String field, String message) {
        return new FieldError(field, message);
    }
}
