package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Contract")
@IdClass(ContractId.class)
@Data
public class Contract {
    @Id
    @Column(name = "DistributorName", nullable = false)
    private String distributorName;

    @Id
    @Column(name = "DistributorAddress", nullable = false)
    private String distributorAddress;

    @Id
    @Column(name = "ManufacturerName", nullable = false)
    private String manufacturerName;

    @Column(name = "Cost", nullable = false)
    private Double cost;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "DistributorName", referencedColumnName = "Name", insertable = false, updatable = false),
            @JoinColumn(name = "DistributorAddress", referencedColumnName = "Address", insertable = false, updatable = false)
    })
    private Distributor distributor;

    @ManyToOne
    @JoinColumn(name = "ManufacturerName", referencedColumnName = "Name", insertable = false, updatable = false)
    private Manufacturer manufacturer;
}