import React from "react"
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import './SortMenu.css';
import { useItemsSearchUpdate } from "../../Context/Context";
import { useSearchParams } from "react-router-dom";


export const SortMenu = ({changeSort, sort, order, handleOrderSwitch }) =>{

    const handleChangeSort = (e) =>{
        changeSort(e)
    }

    const { handleChangeItemsSearch } = useItemsSearchUpdate();
    const [searchParams, setSearchParams]= useSearchParams({order:"asc", sortBy: "brand"})

    return(

        <div className="sort-menu">
            <button className='order-sort'
            onClick={handleOrderSwitch}
            >
              {searchParams.get("order")==='asc' ? 'Rosnąco' : 'Malejąco'}
              {searchParams.get("order")==='asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            <Select.Root defaultValue={sort} onValueChange={handleChangeSort}>
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
                        <SelectItem value="name">Nazwa</SelectItem>
                        <SelectItem value="brand">Marka</SelectItem>
                        <SelectItem value="sku">SKU</SelectItem>
                        <SelectItem value="id">ID</SelectItem>

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
  