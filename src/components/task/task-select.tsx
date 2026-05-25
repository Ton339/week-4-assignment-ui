import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "../ui/select";

export default function TaskSelect({ defaultValue, type }: { defaultValue: string, type: string }) {
    if (type === "status") {
        return (
            <Select defaultValue={defaultValue}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Todo">Todo</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    } else if (type === "priority") {
        return (
            <Select defaultValue={defaultValue}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        <SelectLabel>Priority</SelectLabel>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    }
}