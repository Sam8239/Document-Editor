import tippy from "tippy.js";

const renderSlashCommand = (containerElement, onShown, onHidden) => {
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

            popup = tippy("body", {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component,
                placement: "bottom-start",
                showOnCreate: true,
                interactive: true,
                arrow: false,
                onShown: (instance) => {
                    if (typeof onShown === "function") {
                        onShown(instance);
                    }
                },
                onHidden: (instance) => {
                    if (typeof onHidden === "function") {
                        onHidden(instance);
                    }
                },
            })[0];
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
