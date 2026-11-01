import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import { MappedFormFields } from "../../../src/components/forms.tsx";

function renderCheckbox(orientation?: "vertical" | "horizontal"): string {
  return renderToStaticMarkup(
    React.createElement(MappedFormFields, {
      data: [
        {
          type: "checkbox",
          id: "terms",
          name: "terms",
          label: "Accept the terms",
          orientation,
          description: "Review the terms before continuing.",
          error: "Acceptance is required.",
        },
      ],
    }),
  );
}

test("mapped checkbox fields remain stacked by default", () => {
  const markup = renderCheckbox();
  const labelIndex = markup.indexOf("<label");
  const checkboxIndex = markup.indexOf('role="checkbox"');

  assert.ok(labelIndex >= 0);
  assert.ok(checkboxIndex >= 0);
  assert.ok(
    labelIndex < checkboxIndex,
    "the label precedes the checkbox by default",
  );
  assert.match(markup, /aria-describedby="terms-description terms-error"/);
  assert.match(markup, /id="terms-description"/);
  assert.match(markup, /id="terms-error" role="alert"/);
});

test("horizontal mapped checkbox fields lead with the control and retain feedback associations", () => {
  const markup = renderCheckbox("horizontal");
  const labelIndex = markup.indexOf("<label");
  const checkboxIndex = markup.indexOf('role="checkbox"');

  assert.ok(labelIndex >= 0);
  assert.ok(checkboxIndex >= 0);
  assert.ok(
    checkboxIndex < labelIndex,
    "the checkbox precedes its label when horizontal",
  );
  assert.match(markup, /aria-describedby="terms-description terms-error"/);
  assert.match(markup, /id="terms-description"/);
  assert.match(markup, /id="terms-error" role="alert"/);
});

test("mapped checkbox fields generate an associated id when id and name are omitted", () => {
  const markup = renderToStaticMarkup(
    React.createElement(MappedFormFields, {
      data: [
        {
          type: "checkbox",
          label: "Accept the terms",
          orientation: "horizontal",
          description: "Review the terms before continuing.",
          error: "Acceptance is required.",
        },
      ],
    }),
  );
  const label = markup.match(/<label[^>]*>/)?.[0];
  const checkbox = markup.match(/<button[^>]*role="checkbox"[^>]*>/)?.[0];
  const labelFor = label?.match(/\sfor="([^"]+)"/)?.[1];
  const checkboxId = checkbox?.match(/\sid="([^"]+)"/)?.[1];

  assert.ok(labelFor, "the generated label has a for attribute");
  assert.ok(checkboxId, "the generated checkbox has an id");
  assert.equal(labelFor, checkboxId);
  assert.ok(
    checkbox?.includes(
      `aria-describedby="${checkboxId}-description ${checkboxId}-error"`,
    ),
    "the generated checkbox id scopes its description and error associations",
  );
  assert.ok(markup.includes(`id="${checkboxId}-description"`));
  assert.ok(markup.includes(`id="${checkboxId}-error" role="alert"`));
});

test("custom mapped controls without id or name do not get a dangling label association", () => {
  const markup = renderToStaticMarkup(
    React.createElement(MappedFormFields, {
      data: [
        {
          label: "Download the template",
          control: React.createElement(
            "button",
            { type: "button" },
            "Download",
          ),
        },
      ],
    }),
  );
  const label = markup.match(/<label[^>]*>/)?.[0];
  const button = markup.match(/<button[^>]*>/)?.[0];

  assert.ok(label);
  assert.ok(button);
  assert.doesNotMatch(label, /\sfor="[^"]+"/);
  assert.doesNotMatch(button, /\sid="[^"]+"/);
});
