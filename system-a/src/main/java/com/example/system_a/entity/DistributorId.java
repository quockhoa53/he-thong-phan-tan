package com.example.system_a.entity;

import java.io.Serializable;
import lombok.Data;
import java.util.Objects;

@Data
public class DistributorId implements Serializable {
    private String name;
    private String address;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DistributorId that = (DistributorId) o;
        return Objects.equals(name, that.name) &&
                Objects.equals(address, that.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, address);
    }
}