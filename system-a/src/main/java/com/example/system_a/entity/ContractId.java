package com.example.system_a.entity;

import java.io.Serializable;
import lombok.Data;
import java.util.Objects;

@Data
public class ContractId implements Serializable {
    private String distributorName;
    private String distributorAddress;
    private String manufacturerName;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ContractId that = (ContractId) o;
        return Objects.equals(distributorName, that.distributorName) &&
                Objects.equals(distributorAddress, that.distributorAddress) &&
                Objects.equals(manufacturerName, that.manufacturerName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(distributorName, distributorAddress, manufacturerName);
    }
}