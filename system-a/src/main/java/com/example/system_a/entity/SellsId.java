package com.example.system_a.entity;

import java.io.Serializable;
import lombok.Data;
import java.util.Objects;

@Data
public class SellsId implements Serializable {
    private String distributorName;
    private String distributorAddress;
    private String model;
    private Integer size;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SellsId that = (SellsId) o;
        return Objects.equals(distributorName, that.distributorName) &&
                Objects.equals(distributorAddress, that.distributorAddress) &&
                Objects.equals(model, that.model) &&
                Objects.equals(size, that.size);
    }

    @Override
    public int hashCode() {
        return Objects.hash(distributorName, distributorAddress, model, size);
    }
}