package com.campusmart.model;

public class OrderTimeline {
    private String status;
    private String label;
    private String time;
    private String note;

    public OrderTimeline() {
    }

    public OrderTimeline(String status, String label, String time, String note) {
        this.status = status;
        this.label = label;
        this.time = time;
        this.note = note;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
