package com.example.system_a.entity;

import java.io.Serializable;
import lombok.Data;
import java.util.Objects;

@Data
public class EmploysId implements Serializable {
    private String distributorName;
    private String distributorAddress;
    private String salesSIN;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmploysId that = (EmploysId) o;
        return Objects.equals(distributorName, that.distributorName) &&
                Objects.equals(distributorAddress, that.distributorAddress) &&
                Objects.equals(salesSIN, that.salesSIN);
    }

    @Override
    public int hashCode() {
        return Objects.hash(distributorName, distributorAddress, salesSIN);
    }
}