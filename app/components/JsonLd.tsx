/**
 * A schema.org block. `<` is escaped: a catalogue name holding `</script>` cannot close the
 * tag and leak into the page.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
