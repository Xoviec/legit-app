import React from "react"
import * as Select from '@radix-ui/react-select';
import classnames from 'classnames';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import './SortMenu.css';
import { useItemsSearch, useItemsSearchUpdate } from "../../Context/Context";


export const SortMenu = ({changeSort, sort, order, handleOrderSwitch, changeSetSearchItem}) =>{



    const handleChangeSort = (e) =>{
        changeSort(e)
    }

    const itemsSearch = useItemsSearch()


    const { handleChangeItemsSearch } = useItemsSearchUpdate();

    // Przykładowe zdarzenie, które zmienia wartość itemsSearch
    const handleSearchChange = (e) => {
      // Wywołaj funkcję handleChangeItemsSearch i przekaż nową wartość
      handleChangeItemsSearch(e.target.value);
    };

    return(

        <div className="sort-menu">
          <input value={itemsSearch} type="text" placeholder="Wyszukaj" onChange={handleSearchChange}/>
            <button className='order-sort'
            onClick={handleOrderSwitch}
            >
              {order==='asc' ? 'Rosnąco' : 'Malejąco'}
              {order==='asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
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
                        <SelectItem value="legited_at">Data rejestracji</SelectItem>

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
  