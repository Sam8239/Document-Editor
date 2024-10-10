import tippy from "tippy.js";

const renderSlashCommand = (containerElement, onShown, onHidden, onCommand) => {
    let component;
    let popup;

    Object.assign(containerElement.style, {
        visibility: "hidden",
        opacity: 0,
    });

    return {
        onStart: (props) => {
            component = containerElement;
            component.classList.add("slash-command-triggers");
            Object.assign(containerElement.style, {
                visibility: "visible",
                opacity: 1,
            });

            const attachToElement = props.editor.options.element;

            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => attachToElement,
                content: component,
                placement: "bottom-start",
                showOnCreate: true,
                interactive: true,
                arrow: false,
                onShown: (instance) => {
                    if (typeof onShown === "function") {
                        onShown(instance);
                    }

                    // Adjust width of the popup to match the parent element
                    const cssObj = window.getComputedStyle(attachToElement);
                    const paddingLeft = parseInt(cssObj.paddingLeft, 10);
                    const paddingRight = parseInt(cssObj.paddingRight, 10);
                    const parentWidth = attachToElement.offsetWidth;
                    const containerWidth =
                        parentWidth - (paddingLeft + paddingRight);

                    containerElement.style.width = `${containerWidth}px`;

                    // Optionally, ensure the popup does not overflow
                    const popupElement = instance.popper;
                    popupElement.style.maxWidth = `${containerWidth}px`;
                },
                onHidden: (instance) => {
                    if (typeof onHidden === "function") {
                        onHidden(instance);
                    }
                },
            })[0];

            component
                .querySelectorAll(".command-trigger")
                .forEach((trigger, index) => {
                    trigger.addEventListener("click", () => {
                        // props.command(props.items[index]);
                        if (typeof onCommand === "function") {
                            onCommand(props.items[index], props);
                        }
                    });
                });
        },
        onUpdate: (props) => {},
        onKeyDown: (props) => {
            if (props.event.key === "Escape") {
                popup.hide();
                return true;
            }

            return false;
        },
        onExit: () => {
            popup.destroy();
            component.remove();
        },
    };
};

export default renderSlashCommand;
