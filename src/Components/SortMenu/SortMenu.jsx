import React from "react"
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import './SortMenu.css';


export const SortMenu = ({changeSort}) =>{



    const handleChangeSort = (e) =>{
        changeSort(e)
    }

    return(

        <div className="sort-menu">
            <Select.Root defaultValue="name" onValueChange={handleChangeSort}>
                <Select.Trigger className="SelectTrigger" aria-label="Sorting">
                <Select.Value placeholder="Sortuj" />
                <Select.Icon className="SelectIcon">
                    <ChevronDownIcon />
                </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                <Select.Content position="popper" className="SelectContent">
                    <Select.ScrollUpButton className="SelectScrollButton">
                    <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport className="SelectViewport">
                    <Select.Group>
                        <Select.Label className="SelectLabel">Sortowanie</Select.Label>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="brand">Brand</SelectItem>
                        <SelectItem value="squ">SQU</SelectItem>
                    </Select.Group>
                    </Select.Viewport>
                    <Select.ScrollDownButton className="SelectScrollButton">
                    <ChevronDownIcon />
                    </Select.ScrollDownButton>
                </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
      
    )
}


const SelectItem = React.forwardRef(({ children, className, ...props }, forwardedRef) => {

    return (
      <Select.Item className={classnames('SelectItem', className)} {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  });
  