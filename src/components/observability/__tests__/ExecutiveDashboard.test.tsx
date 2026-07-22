import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExecutiveDashboard } from "../ExecutiveDashboard";
import { mockSnapshot } from "@/data/mockObservability";

describe("ExecutiveDashboard", () => {
  it("shows loading overlay when loading=true", () => {
    render(<ExecutiveDashboard loading={true} data={null} />);
    expect(screen.getByText(/loading observability data/i)).toBeInTheDocument();
  });

  it("shows empty state when no data and not loading", () => {
    render(<ExecutiveDashboard data={null} loading={false} />);
    expect(screen.getByText(/no observability data/i)).toBeInTheDocument();
  });

  it("renders equipment name and KPIs when data is provided", () => {
    render(<ExecutiveDashboard data={mockSnapshot} loading={false} />);
    expect(screen.getByText(/line 3 drive motor/i)).toBeInTheDocument();
    expect(screen.getByText(/executive view/i)).toBeInTheDocument();
    // At least one KPI label should appear
    expect(screen.getByText(/asset health index/i)).toBeInTheDocument();
  });

  it("shows partial banner when partial=true", () => {
    render(
      <ExecutiveDashboard data={mockSnapshot} loading={false} partial={true} />,
    );
    expect(screen.getByText(/partial snapshot/i)).toBeInTheDocument();
  });

  it("shows error banner when errorMessage is provided", () => {
    render(
      <ExecutiveDashboard
        data={null}
        loading={false}
        errorMessage="Adapter failed: bad payload"
      />,
    );
    expect(screen.getByText(/adapter failed: bad payload/i)).toBeInTheDocument();
  });
});
