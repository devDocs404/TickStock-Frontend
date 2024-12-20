import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CustomTooltipProps {
  toolContent: string | React.ReactNode;
  toolTrigger: JSX.Element;
  toolDuration?: number;
}

export default function CustomTooltip({
  toolContent,
  toolTrigger,
  toolDuration,
}: CustomTooltipProps) {
  return (
    <TooltipProvider delayDuration={toolDuration || 300}>
      <Tooltip>
        <TooltipTrigger asChild>{toolTrigger}</TooltipTrigger>
        <TooltipContent className="relative dark px-2 py-1 text-xs">
          {toolContent}
          {/* Add an arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
