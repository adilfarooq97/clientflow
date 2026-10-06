"use client";

import { useState } from "react";
import type { Project, ProjectStatus } from "@/types";
import ProjectCard from "@/components/dashboard/ProjectCard";

type ProjectStatusFilterProps = {
  projects: Project[];
};

const statuses: Array<"All" | ProjectStatus> = [
  "All",
  "Planning",
  "In Progress",
  "Review",
  "Completed",
];

export default function ProjectStatusFilter({
  projects,
}: ProjectStatusFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | ProjectStatus
  >("All");
  const filteredProjects =
    selectedStatus === "All"
      ? projects
      : projects.filter((project) => project.status === selectedStatus);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setSelectedStatus(status)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${selectedStatus === status
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            {status}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-900">
          {filteredProjects.length}
        </span>{" "}
        {filteredProjects.length === 1 ? "project" : "projects"}
      </p>

      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            No {selectedStatus === "All" ? "" : selectedStatus.toLowerCase()} projects
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try selecting a different status to view other projects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>
      )}
    </div>
  );
}