import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  snsName: string;
  image: string;
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ShareButton = ({
  snsName,
  image,
  className,
  children,
  ...props
}: Props) => {
  return (
    <Button className={cn("px-6 w-[220px]", className)} {...props}>
      <img
        src={image}
        alt={snsName}
        width="20px"
        height="20px"
        className={cn("mr-2", className)}
      />
      {children}
    </Button>
  );
};
