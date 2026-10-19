package com.hospitality.dto;

import java.math.BigDecimal;

public class ReservationTrendDTO {

    private String label;
    private long count;
    private BigDecimal revenue;

    public ReservationTrendDTO() {}

    public ReservationTrendDTO(String label, long count, BigDecimal revenue) {
        this.label = label;
        this.count = count;
        this.revenue = revenue;
    }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }
}
