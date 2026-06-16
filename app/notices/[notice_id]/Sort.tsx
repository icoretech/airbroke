import SortDropdown from "@/components/common/SortDropdown";

const sortAttributes = ["seen_count", "updated_at"] as const;

export default function Sort() {
  return (
    <SortDropdown
      ariaLabel="Sort occurrences"
      attributes={sortAttributes}
      defaultAttr="updated_at"
      defaultDir="desc"
    />
  );
}
