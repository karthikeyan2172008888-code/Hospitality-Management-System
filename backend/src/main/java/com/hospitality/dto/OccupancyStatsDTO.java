package com.hospitality.dto;

public class OccupancyStatsDTO {

    private String category;
    private long count;
    private double percentage;

    public OccupancyStatsDTO() {}

    public OccupancyStatsDTO(String category, long count, double percentage) {
        this.category = category;
        this.count = count;
        this.percentage = percentage;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
