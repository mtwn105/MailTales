import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center mt-4
  ">
      <Spinner
        size="lg"
        color="primary"
        label="Loading dashboard..."
      />
    </div>
  );
}
