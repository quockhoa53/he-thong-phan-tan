package com.example.system_a.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Makes")
@IdClass(MakesId.class)
@Data
public class Makes {
    @Id
    @Column(name = "ManufacturerName", nullable = false)
    private String manufacturerName;

    @Id
    @Column(name = "Model", nullable = false)
    private String model;

    @Id
    @Column(name = "Size", nullable = false)
    private Integer size;

    @Column(name = "Prod_Cost", nullable = false)
    private Double prodCost;

    @ManyToOne
    @JoinColumn(name = "ManufacturerName", referencedColumnName = "Name", insertable = false, updatable = false)
    private Manufacturer manufacturer;

    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "Model", referencedColumnName = "Model", insertable = false, updatable = false),
            @JoinColumn(name = "Size", referencedColumnName = "Size", insertable = false, updatable = false)
    })
    private Shoes shoes;
}