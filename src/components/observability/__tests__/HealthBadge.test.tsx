import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HealthBadge } from "../HealthBadge";

describe("HealthBadge", () => {
  it("renders Healthy label for healthy state", () => {
    render(<HealthBadge state="healthy" />);
    expect(screen.getByText(/healthy/i)).toBeInTheDocument();
  });

  it("renders Warning label for warning state", () => {
    render(<HealthBadge state="warning" />);
    expect(screen.getByText(/warning/i)).toBeInTheDocument();
  });

  it("renders Critical label for critical state", () => {
    render(<HealthBadge state="critical" />);
    expect(screen.getByText(/critical/i)).toBeInTheDocument();
  });

  it("hides label when showLabel is false", () => {
    render(<HealthBadge state="healthy" showLabel={false} />);
    expect(screen.queryByText(/healthy/i)).not.toBeInTheDocument();
  });

  it("renders Offline for offline state", () => {
    render(<HealthBadge state="offline" />);
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });
});
