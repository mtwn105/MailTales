import { LoadingSpinner } from "@/components/ui/spinner";
export default function Loading() {
  return (
    <div
      className="flex justify-center items-center mt-4
  "
    >
      <LoadingSpinner message="Loading email..." />
    </div>
  );
}
