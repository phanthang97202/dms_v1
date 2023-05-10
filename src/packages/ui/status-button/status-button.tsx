interface StatusButtonProps {
  isActive: boolean;
}
export const StatusButton = ({ isActive }: StatusButtonProps) => {
  return (
    <div
      className={
        "status-button min-w-[80px] w-[80px] h-[20px] rounded flex items-center text-white"
      }
    >
      <div
        className={`px-4 py-1 flex-1 flex items-center justify-center rounded ${
          isActive ? "bg-s-active" : "bg-s-inactive"
        }`}
      >{`${isActive ? "Active" : "Inactive"}`}</div>
    </div>
  );
};
