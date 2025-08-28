import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  className, 
  inputClassName,
  ...props 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label htmlFor={props.id}>{label}</Label>
      )}
      <Input 
        className={cn(
          error && "border-error focus:ring-error focus:border-error",
          inputClassName
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  )
}

export default FormField