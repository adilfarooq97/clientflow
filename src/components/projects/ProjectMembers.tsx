import type { ProjectMember } from "@/types";
import RemoveProjectMemberButton from "@/components/projects/RemoveProjectMemberButton";

type ProjectMembersProps = {
  members: ProjectMember[];
  profiles: {
    id: string;
    full_name: string;
    role: "client" | "freelancer";
  }[];
  canManage?: boolean;
};

export default function ProjectMembers({
  members,
  profiles,
  canManage = false,
}: ProjectMembersProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">
            Project Members
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            People with access to this project
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
          {members.length}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {members.length === 0 ? (
          <p className="text-sm text-gray-500">
            No members have been added yet.
          </p>
        ) : (
          members.map((member) => {
            const profile = profiles.find(
              (item) => item.id === member.user_id
            );

            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.full_name ?? "Unknown user"}
                  </p>

                  <p className="text-xs capitalize text-gray-500">
                    {member.role}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    {member.role}
                  </span>

                  {canManage && (
                    <RemoveProjectMemberButton
                      memberId={member.id}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}