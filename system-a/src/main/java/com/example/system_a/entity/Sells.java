package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Sells")
@IdClass(SellsId.class)
@Data
public class Sells {
    @Id
    @Column(name = "DistributorName", nullable = false)
    private String distributorName;

    @Id
    @Column(name = "DistributorAddress", nullable = false)
    private String distributorAddress;

    @Id
    @Column(name = "Model", nullable = false)
    private String model;

    @Id
    @Column(name = "Size", nullable = false)
    private Integer size;

    @Column(name = "Cost", nullable = false)
    private Double cost;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "DistributorName", referencedColumnName = "Name", insertable = false, updatable = false),
            @JoinColumn(name = "DistributorAddress", referencedColumnName = "Address", insertable = false, updatable = false)
    })
    private Distributor distributor;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "Model", referencedColumnName = "Model", insertable = false, updatable = false),
            @JoinColumn(name = "Size", referencedColumnName = "Size", insertable = false, updatable = false)
    })
    private Shoes shoes;
}