import { c as compute_rest_props, a as compute_slots, s as subscribe } from "../../chunks/utils.js";
import { c as create_ssr_component, a as spread, b as escape_object, e as escape_attribute_value, d as add_attribute, h as getContext, v as validate_component, f as escape, i as each } from "../../chunks/ssr.js";
import { W as Wrapper, I as Input, U as UserCircleSolid, B as Button } from "../../chunks/UserCircleSolid.js";
import { twMerge } from "tailwind-merge";
import { H as Heading } from "../../chunks/Heading.js";
import "../../chunks/client.js";
import "../../chunks/api.js";
import { p as page } from "../../chunks/stores.js";
import { m as modalStore } from "../../chunks/modal.js";
const Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let labelClass2;
  let $$restProps = compute_rest_props($$props, ["color", "defaultClass", "show"]);
  let { color = "gray" } = $$props;
  let { defaultClass = "text-sm rtl:text-right font-medium block" } = $$props;
  let { show = true } = $$props;
  let node;
  const colorClasses2 = {
    gray: "text-gray-900 dark:text-gray-300",
    green: "text-green-700 dark:text-green-500",
    red: "text-red-700 dark:text-red-500",
    disabled: "text-gray-400 dark:text-gray-500"
  };
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.defaultClass === void 0 && $$bindings.defaultClass && defaultClass !== void 0)
    $$bindings.defaultClass(defaultClass);
  if ($$props.show === void 0 && $$bindings.show && show !== void 0)
    $$bindings.show(show);
  {
    {
      color = color;
    }
  }
  labelClass2 = twMerge(defaultClass, colorClasses2[color], $$props.class);
  return `${show ? ` <label${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(labelClass2)
      }
    ],
    {}
  )}${add_attribute("this", node, 0)}>${slots.default ? slots.default({}) : ``}</label>` : `${slots.default ? slots.default({}) : ``}`} `;
});
const colorClasses = {
  primary: "text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600",
  secondary: "text-secondary-600 focus:ring-secondary-500 dark:focus:ring-secondary-600",
  red: "text-red-600 focus:ring-red-500 dark:focus:ring-red-600",
  green: "text-green-600 focus:ring-green-500 dark:focus:ring-green-600",
  purple: "text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600",
  teal: "text-teal-600 focus:ring-teal-500 dark:focus:ring-teal-600",
  yellow: "text-yellow-400 focus:ring-yellow-500 dark:focus:ring-yellow-600",
  orange: "text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-600",
  blue: "text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600"
};
const labelClass = (inline, extraClass) => twMerge(inline ? "inline-flex" : "flex", "items-center", extraClass);
const inputClass = (custom, color, rounded, tinted, spacing, extraClass) => twMerge(
  "w-4 h-4 bg-gray-100 border-gray-300 dark:ring-offset-gray-800 focus:ring-2",
  spacing,
  tinted ? "dark:bg-gray-600 dark:border-gray-500" : "dark:bg-gray-700 dark:border-gray-600",
  custom && "sr-only peer",
  rounded && "rounded",
  colorClasses[color],
  extraClass
);
const Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "custom", "inline", "group", "value", "checked", "spacing"]);
  let $$slots = compute_slots(slots);
  let { color = "primary" } = $$props;
  let { custom = false } = $$props;
  let { inline = false } = $$props;
  let { group = [] } = $$props;
  let { value = "on" } = $$props;
  let { checked = void 0 } = $$props;
  let { spacing = "me-2" } = $$props;
  let background = getContext("background");
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.custom === void 0 && $$bindings.custom && custom !== void 0)
    $$bindings.custom(custom);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  return `${validate_component(Label, "Label").$$render(
    $$result,
    {
      class: labelClass(inline, $$props.class),
      show: $$slots.default
    },
    {},
    {
      default: () => {
        return `<input${spread(
          [
            { type: "checkbox" },
            { value: escape_attribute_value(value) },
            escape_object($$restProps),
            {
              class: escape_attribute_value(inputClass(custom, color, true, background, spacing, $$slots.default || $$props.class))
            }
          ],
          {}
        )}${add_attribute("checked", checked, 1)}> ${slots.default ? slots.default({}) : ``}`;
      }
    }
  )} `;
});
const Dropzone = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "files", "defaultClass"]);
  let { value = "" } = $$props;
  let { files = void 0 } = $$props;
  let { defaultClass = "flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.defaultClass === void 0 && $$bindings.defaultClass && defaultClass !== void 0)
    $$bindings.defaultClass(defaultClass);
  return `<button${add_attribute("class", twMerge(defaultClass, $$props.class), 0)} type="button">${slots.default ? slots.default({}) : ``}</button> <label class="hidden"><input${spread([escape_object($$restProps), { type: "file" }], {})}></label> `;
});
const Helper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["helperClass", "color"]);
  let { helperClass = "text-xs font-normal text-gray-500 dark:text-gray-300" } = $$props;
  let { color = "gray" } = $$props;
  const colorClasses2 = {
    gray: "text-gray-900 dark:text-gray-300",
    green: "text-green-700 dark:text-green-500",
    red: "text-red-700 dark:text-red-500",
    disabled: "text-gray-400 dark:text-gray-500"
  };
  if ($$props.helperClass === void 0 && $$bindings.helperClass && helperClass !== void 0)
    $$bindings.helperClass(helperClass);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<p${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(twMerge(helperClass, colorClasses2[color], $$props.class))
      }
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</p> `;
});
const common = "block w-full";
const Select = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "items",
    "value",
    "placeholder",
    "underline",
    "size",
    "defaultClass",
    "underlineClass"
  ]);
  let { items = [] } = $$props;
  let { value = void 0 } = $$props;
  let { placeholder = "Choose option ..." } = $$props;
  let { underline = false } = $$props;
  let { size = "md" } = $$props;
  let { defaultClass = "text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" } = $$props;
  let { underlineClass = "text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" } = $$props;
  const sizes = {
    sm: "text-sm p-2",
    md: "text-sm p-2.5",
    lg: "text-base py-3 px-4"
  };
  let selectClass;
  if ($$props.items === void 0 && $$bindings.items && items !== void 0)
    $$bindings.items(items);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.underline === void 0 && $$bindings.underline && underline !== void 0)
    $$bindings.underline(underline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.defaultClass === void 0 && $$bindings.defaultClass && defaultClass !== void 0)
    $$bindings.defaultClass(defaultClass);
  if ($$props.underlineClass === void 0 && $$bindings.underlineClass && underlineClass !== void 0)
    $$bindings.underlineClass(underlineClass);
  selectClass = twMerge(common, underline ? underlineClass : defaultClass, sizes[size], underline && "!px-0", $$props.class);
  return `<select${spread(
    [
      escape_object($$restProps),
      {
        class: escape_attribute_value(selectClass)
      }
    ],
    {}
  )}>${placeholder ? `<option disabled selected value="">${escape(placeholder)}</option>` : ``}${items.length ? each(items, ({ value: value2, name }) => {
    return `<option${add_attribute("value", value2, 0)}>${escape(name)}</option>`;
  }) : `${slots.default ? slots.default({}) : ``}`}</select> `;
});
const Textarea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["value", "wrappedClass", "unWrappedClass", "innerWrappedClass"]);
  let $$slots = compute_slots(slots);
  const background = getContext("background");
  let { value = void 0 } = $$props;
  let { wrappedClass = "block w-full text-sm border-0 px-0 bg-inherit dark:bg-inherit focus:outline-none focus:ring-0" } = $$props;
  let { unWrappedClass = "p-2.5 text-sm focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500" } = $$props;
  let { innerWrappedClass = "py-2 px-4 bg-white dark:bg-gray-800" } = $$props;
  let wrapped;
  let wrapperClass;
  let textareaClass;
  const headerClass = (header) => twMerge(header ? "border-b" : "border-t", "py-2 px-3 border-gray-200 dark:border-gray-600");
  let innerWrapperClass;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.wrappedClass === void 0 && $$bindings.wrappedClass && wrappedClass !== void 0)
    $$bindings.wrappedClass(wrappedClass);
  if ($$props.unWrappedClass === void 0 && $$bindings.unWrappedClass && unWrappedClass !== void 0)
    $$bindings.unWrappedClass(unWrappedClass);
  if ($$props.innerWrappedClass === void 0 && $$bindings.innerWrappedClass && innerWrappedClass !== void 0)
    $$bindings.innerWrappedClass(innerWrappedClass);
  wrapped = $$slots.header || $$slots.footer;
  wrapperClass = twMerge(
    "w-full rounded-lg",
    background ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700",
    "text-gray-900 dark:placeholder-gray-400 dark:text-white ",
    "border border-gray-200 dark:border-gray-600",
    $$props.class
  );
  textareaClass = wrapped ? wrappedClass : twMerge(wrapperClass, unWrappedClass);
  innerWrapperClass = twMerge(innerWrappedClass, $$slots.footer ? "" : "rounded-b-lg", $$slots.header ? "" : "rounded-t-lg");
  return `${validate_component(Wrapper, "Wrapper").$$render($$result, { show: wrapped, class: wrapperClass }, {}, {
    default: () => {
      return `${$$slots.header ? `<div${add_attribute("class", headerClass(true), 0)}>${slots.header ? slots.header({}) : ``}</div>` : ``} ${validate_component(Wrapper, "Wrapper").$$render($$result, { show: wrapped, class: innerWrapperClass }, {}, {
        default: () => {
          return `<textarea${spread(
            [
              escape_object($$restProps),
              {
                class: escape_attribute_value(textareaClass)
              }
            ],
            {}
          )}>${escape(value || "")}</textarea>`;
        }
      })} ${$$slots.footer ? `<div${add_attribute("class", headerClass(false), 0)}>${slots.footer ? slots.footer({}) : ``}</div>` : ``}`;
    }
  })} `;
});
const Botr = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { valid = false } = $$props;
  let wabe = "";
  let boxes = [
    { value: false },
    { value: false },
    { value: false },
    { value: false },
    { value: false },
    { value: false },
    { value: false },
    { value: false },
    { value: false }
  ];
  let solution = [];
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  return `${validate_component(Heading, "Heading").$$render($$result, { tag: "h5" }, {}, {
    default: () => {
      return `Spam Schutz`;
    }
  })} <input name="wabe" type="text" style="height: 1px; opacity: 0"${add_attribute("value", wabe, 0)}> <div class="mb-3 flex gap-3"><div><p class="dark:text-white" data-svelte-h="svelte-psxi1v">Generiert</p> <div class="grid grid-cols-3 grid-rows-3 w-[60px]">${each(solution, (item, i) => {
    return `<div class="${"border h-[20px] " + escape(item.value ? "bg-neutral-400" : "bg-neutral-100", true)}"></div>`;
  })}</div></div> <div class="min-w-[100px]"><p class="dark:text-white" data-svelte-h="svelte-18xwfz1">Deine Kopie</p> <div class="grid grid-cols-3 grid-rows-3 w-[60px]">${each(boxes, (item, i) => {
    return `<div class="${"border h-[20px] " + escape(item.value ? "bg-neutral-400" : "bg-neutral-100", true)}" role="button" tabindex="0"></div>`;
  })}</div></div> <div class="pt-6" data-svelte-h="svelte-8xdwgz"><p class="dark:text-white"><span class="font-medium">Hilfe:</span>
            Erzeuge das genaue Abbild von &quot;Generiert&quot;, indem du im zweiten Feld (&quot;Deine Kopie&quot;) die jeweiligen Kästchen klickst.</p></div></div>`;
});
const css = {
  code: ".banner.svelte-16kowbh{background-image:url('/barkeeper-1400x600.jpg');background-size:cover;background-position:bottom left;background-repeat:no-repeat;height:50vh}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_modalStore;
  let $page, $$unsubscribe_page;
  $$unsubscribe_modalStore = subscribe(modalStore, (value) => value);
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  let form;
  let valid = false;
  let candidate = {
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    region: $page.url.searchParams.get("region") || "",
    application_field: $page.url.searchParams.get("application") || "Service",
    letter_motivation: "",
    photo: null,
    reCapRes: "",
    application_source: "Recruiting-Formular",
    facebook: void 0,
    instagram: void 0
  };
  let regions = [
    { value: "Berlin", name: "Berlin" },
    { value: "Hamburg", name: "Hamburg" },
    { value: "München", name: "München" }
  ];
  let application_fields = [
    { value: "Service", name: "Service" },
    { value: "Event", name: "Event" },
    { value: "Driver", name: "Driver" },
    { value: "Promotion", name: "Promotion" },
    { value: "Messe", name: "Messe" },
    { value: "Küche", name: "Küche" },
    { value: "Logistik", name: "Logistik" },
    { value: "Sales", name: "Sales" },
    { value: "IT", name: "IT" },
    { value: "Consulting", name: "Consulting" },
    { value: "Backoffice", name: "Backoffice" }
  ].sort((a, b) => a.name.localeCompare(b.name));
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="w-full banner svelte-16kowbh"></div> <div class="md:w-4/5 px-2 lg:max-w-screen-lg mx-auto mb-24"><section><div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12" data-svelte-h="svelte-3s0l2p"><p class="mb-4 text-2xl font-normal tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white">Wir bieten:</p> <h1 class="mb-4 text-3xl font-extrabold tracking-tight leading-none text-gray-700 md:text-4xl lg:text-5xl dark:text-white">Den flexibelsten Nebenjob der Stadt</h1> <p class="font-semibold mb-2 dark:text-white">Täglich neue Jobs und Aufgaben als Teil einer familiären Crew meistern:</p> <p class="dark:text-white">Werde ein Teil unserer Crew und bewirb dich noch heute bei uns! Wir freuen uns auf deine (Schnell)
                Bewerbung.</p></div> <div class="rounded-lg shadow shadow-primary-400 py-3 px-4">${validate_component(Heading, "Heading").$$render($$result, { class: "text-neutral-600", tag: "h3" }, {}, {
      default: () => {
        return `Schnellbewerbung`;
      }
    })} <form class="mt-4"${add_attribute("this", form, 0)}><div class="grid gap-6 mb-6 md:grid-cols-2"><div>${validate_component(Label, "Label").$$render($$result, { for: "first_name", class: "mb-2" }, {}, {
      default: () => {
        return `Vorname`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "text",
        id: "first_name",
        placeholder: "Max",
        required: true,
        value: candidate.firstname
      },
      {
        value: ($$value) => {
          candidate.firstname = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "last_name", class: "mb-2" }, {}, {
      default: () => {
        return `Nachname`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "text",
        id: "last_name",
        placeholder: "Mustermann",
        required: true,
        value: candidate.lastname
      },
      {
        value: ($$value) => {
          candidate.lastname = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "email", class: "mb-2" }, {}, {
      default: () => {
        return `E-Mail`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "email",
        id: "email",
        placeholder: "max.mustermann@googlemail.com",
        required: true,
        value: candidate.email
      },
      {
        value: ($$value) => {
          candidate.email = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "mobile", class: "mb-2" }, {}, {
      default: () => {
        return `Handynummer`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        pattern: "[\\+]\\d{1,3}\\s*\\d{3,4}\\s*\\d{4,8}",
        type: "text",
        id: "mobile",
        placeholder: "+49 161 123456",
        required: true,
        value: candidate.mobile
      },
      {
        value: ($$value) => {
          candidate.mobile = $$value;
          $$settled = false;
        }
      },
      {}
    )} <div class="relative">${candidate.mobile.length > 3 && !candidate.mobile.match(/\+\d{1,3}\s*\d{3,4}\s*\d{4,8}/) ? `${validate_component(Helper, "Helper").$$render($$result, { class: "absolute", color: "yellow" }, {}, {
      default: () => {
        return `Formatierung beachten: +[Land] [Vorwahl] [Nummer] <span class="text-[11px]" data-svelte-h="svelte-dvny2n">(z.B. +49 161 123456)</span>`;
      }
    })}` : `${candidate.mobile.length > 0 && !candidate.mobile.match(/\+\d{1,3}/) ? `${validate_component(Helper, "Helper").$$render($$result, { class: "absolute", color: "red" }, {}, {
      default: () => {
        return `Bitte Ländervorwahl angeben <span class="text-[11px]" data-svelte-h="svelte-1ru702c">(z.B. +49)</span>`;
      }
    })}` : ``}`}</div></div> <div>${validate_component(Label, "Label").$$render($$result, { for: "region", class: "mb-2" }, {}, {
      default: () => {
        return `Region`;
      }
    })} ${validate_component(Select, "Select").$$render(
      $$result,
      {
        id: "region",
        required: true,
        items: regions,
        value: candidate.region
      },
      {
        value: ($$value) => {
          candidate.region = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "application_field", class: "mb-2" }, {}, {
      default: () => {
        return `Einsatzbereich`;
      }
    })} ${validate_component(Select, "Select").$$render(
      $$result,
      {
        id: "application_field",
        required: true,
        items: application_fields,
        value: candidate.application_field
      },
      {
        value: ($$value) => {
          candidate.application_field = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "facebook", class: "mb-2" }, {}, {
      default: () => {
        return `Facebook Profil`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "text",
        id: "facebook",
        placeholder: "https://www.facebook.com/hans.mustermann",
        value: candidate.facebook
      },
      {
        value: ($$value) => {
          candidate.facebook = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Helper, "Helper").$$render($$result, { class: "mt-0.5 pl-1" }, {}, {
      default: () => {
        return `Optional`;
      }
    })}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "insta", class: "mb-2" }, {}, {
      default: () => {
        return `Instagram Profil`;
      }
    })} ${validate_component(Input, "Input").$$render(
      $$result,
      {
        type: "text",
        id: "insta",
        placeholder: "https://www.instagram.com/mustermann/",
        value: candidate.instagram
      },
      {
        value: ($$value) => {
          candidate.instagram = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Helper, "Helper").$$render($$result, { class: "mt-0.5 pl-1" }, {}, {
      default: () => {
        return `Optional`;
      }
    })}</div> <div>${validate_component(Label, "Label").$$render($$result, { for: "letter_motivation", class: "mb-2" }, {}, {
      default: () => {
        return `Du willst ins Team weil...`;
      }
    })} ${validate_component(Textarea, "Textarea").$$render(
      $$result,
      {
        minlength: "5",
        maxlength: "700",
        rows: "9",
        id: "letter_motivation",
        required: true,
        value: candidate.letter_motivation
      },
      {
        value: ($$value) => {
          candidate.letter_motivation = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Helper, "Helper").$$render(
      $$result,
      {
        class: "mt-1",
        color: candidate.letter_motivation.length < 5 || candidate.letter_motivation.length > 700 ? "red" : "green"
      },
      {},
      {
        default: () => {
          return `${escape(candidate.letter_motivation.length)}/700`;
        }
      }
    )}</div> <div class="mt-2">${validate_component(Dropzone, "Dropzone").$$render($$result, {}, {}, {
      default: () => {
        return `${`${validate_component(UserCircleSolid, "UserCircleSolid").$$render(
          $$result,
          {
            class: "w-12 h-12 text-primary-800/70 dark:text-white"
          },
          {},
          {}
        )} ${validate_component(Heading, "Heading").$$render($$result, { class: "text-neutral-600", tag: "h4" }, {}, {
          default: () => {
            return `Bild hochladen`;
          }
        })} <p class="mb-2 text-sm text-gray-500 dark:text-gray-400" data-svelte-h="svelte-1h8l8r"><span class="font-semibold">Klicken</span> oder drag &amp; drop</p> <p class="text-xs text-gray-500 dark:text-gray-400" data-svelte-h="svelte-9w4jrl">PNG oder JPG</p>`}`;
      }
    })}</div></div> <div class="grid gap-3">${validate_component(Botr, "Botr").$$render(
      $$result,
      { valid },
      {
        valid: ($$value) => {
          valid = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(Checkbox, "Checkbox").$$render($$result, { required: true }, {}, {
      default: () => {
        return `Ich bin mit der Verarbeitung meiner Daten einverstanden <span class="text-xs pl-2" data-svelte-h="svelte-1uedt3d">(<a class="visited:text-blue-600 hover:text-blue-600 text-blue-500" rel="nofollow noopener" target="_blank" href="https://www.recrew.info/kopie-von-dsgvo">Datenschutzerklärung</a>)</span>`;
      }
    })} ${validate_component(Button, "Button").$$render($$result, { disabled: !valid, type: "submit" }, {}, {
      default: () => {
        return `BEWERBEN`;
      }
    })}</div></form></div></section></div>`;
  } while (!$$settled);
  $$unsubscribe_modalStore();
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};
