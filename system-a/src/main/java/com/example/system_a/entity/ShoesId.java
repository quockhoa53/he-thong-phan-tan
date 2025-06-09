package com.example.system_a.entity;

import java.io.Serializable;
import lombok.Data;
import java.util.Objects;

@Data
public class ShoesId implements Serializable {
    private String model;
    private Integer size;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShoesId that = (ShoesId) o;
        return Objects.equals(model, that.model) &&
                Objects.equals(size, that.size);
    }

    @Override
    public int hashCode() {
        return Objects.hash(model, size);
    }
}