import SortDropdown from "@/components/common/SortDropdown";

const sortAttributes = ["kind", "seen_count", "env", "updated_at"] as const;

export default function Sort() {
  return (
    <SortDropdown
      ariaLabel="Sort notices"
      attributes={sortAttributes}
      defaultAttr="updated_at"
      defaultDir="desc"
    />
  );
}
