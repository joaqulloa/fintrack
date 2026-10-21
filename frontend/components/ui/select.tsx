"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  id?: string;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  invalid?: boolean;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  id,
  className = "",
  size = "md",
  disabled = false,
  invalid = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dropUp, setDropUp] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const generatedId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const listboxId = `select-${generatedId}`;
  const optionId = (index: number) => `${listboxId}-option-${index}`;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const activeOptionIndex =
    options.length === 0 ? 0 : Math.min(activeIndex, options.length - 1);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const updateDropUp = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setDropUp(spaceBelow < 200 && spaceAbove > spaceBelow);
  };

  useEffect(() => {
    if (!open) return;

    const handleResize = () => updateDropUp();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const container = listboxRef.current;
    const item = optionRefs.current[activeOptionIndex];
    if (!container || !item) return;

    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;

    if (itemTop < container.scrollTop) {
      container.scrollTop = itemTop;
    } else if (itemBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = itemBottom - container.clientHeight;
    }
  }, [activeOptionIndex, open]);

  const openMenu = (index?: number) => {
    setActiveIndex(index ?? (selectedIndex >= 0 ? selectedIndex : 0));
    updateDropUp();
    setOpen(true);
  };

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;

    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerClick = () => {
    if (disabled) return;

    if (open) {
      setOpen(false);
    } else {
      openMenu();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled || options.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          setActiveIndex((prev) => (Math.min(prev, options.length - 1) + 1) % options.length);
        } else {
          openMenu();
        }
        break;

      case "ArrowUp":
        event.preventDefault();
        if (open) {
          setActiveIndex(
            (prev) => (Math.min(prev, options.length - 1) - 1 + options.length) % options.length,
          );
        } else {
          openMenu(selectedIndex >= 0 ? selectedIndex : options.length - 1);
        }
        break;

      case "Home":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(0);
        break;

      case "End":
        if (!open) return;
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          selectOption(activeOptionIndex);
        } else {
          openMenu();
        }
        break;

      case "Escape":
        if (!open) return;
        event.preventDefault();
        event.stopPropagation();
        setOpen(false);
        break;

      case "Tab":
        setOpen(false);
        break;

      default:
        break;
    }
  };

  const triggerClassName = `
    flex w-full items-center justify-between gap-2 rounded-xl border bg-white text-sm
    outline-none transition focus:ring-2
    ${size === "sm" ? "px-3 py-2" : "px-3.5 py-2.5"}
    ${
      invalid
        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
    }
    ${open && !invalid ? "border-blue-500 ring-2 ring-blue-100" : ""}
    ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}
    ${className}
  `;

  return (
    <div ref={wrapperRef} className="relative" onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="none"
        aria-activedescendant={open ? optionId(activeOptionIndex) : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={handleTriggerClick}
        className={triggerClassName}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={id}
          className={`absolute z-50 max-h-60 w-full overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1 shadow-lg shadow-slate-900/5 ${
            dropUp
              ? "bottom-full mb-2 animate-select-in-up"
              : "mt-2 animate-select-in"
          }`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeOptionIndex;

            return (
              <li
                key={option.value}
                id={optionId(index)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(index)}
                className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-blue-50 font-medium text-blue-700"
                    : isActive
                      ? "bg-slate-50 text-slate-900"
                      : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="truncate">{option.label}</span>

                {isSelected && (
                  <Check
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-blue-600"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
