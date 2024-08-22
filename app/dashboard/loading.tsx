import { Spinner } from "@nextui-org/spinner";

export default function Loading() {
  return (
    <div className="flex justify-center items-center ">
      <Spinner
        size="lg"
        color="primary"
        label="Fetching your latest emails..."
      />
    </div>
  );
}
