import { type ComponentProps, type CSSProperties, useId } from "react";
import { cn } from "@/lib/utils";

export interface GridPatternProps extends ComponentProps<"div"> {
  /** The side of one square cell, in pixels. @default 40 */
  cellSize?: number;
  /**
   * Where the grid fades out: toward every edge from the centre
   * (`radial`), toward the top, or toward the bottom. It's a mask, so the
   * grid fades into whatever is behind it.
   *
   * @default "none"
   */
  fade?: "none" | "radial" | "top" | "bottom";
  /** The lines' colour, any CSS colour. @default "var(--border)" */
  lineColor?: string;
  /** The filled cells' colour, any CSS colour. @default "var(--muted)" */
  squareColor?: string;
  /** Cells to fill, each `[column, row]` counted from the top-left cell, `[0, 0]`. */
  squares?: [number, number][];
  /**
   * The lines' dashes, in SVG's dash syntax: `"4 4"` for dashes, `"1 3"`
   * for dots. Solid when left out.
   */
  strokeDasharray?: string;
}

const NOT_AN_ID = /[^\w-]/g;

/** The pattern's id, from a unique id made safe for `url(#…)`. */
const idOf = (unique: string) =>
  `grid-pattern-${unique.replace(NOT_AN_ID, "")}`;

/** Each filled cell's corner: the grid sits 1px up and left, so a cell starts on a multiple of its size. */
const cellsOf = (size: number, squares: [number, number][] = []) =>
  squares.map(([column, row], key) => ({
    key,
    x: column * size,
    y: row * size,
  }));

/** Where the grid fades out: a static mask on the layer, for every value. */
const FADE = {
  bottom: "[mask-image:linear-gradient(to_bottom,black_40%,transparent)]",
  none: "",
  radial: "[mask-image:radial-gradient(closest-side,black_40%,transparent)]",
  top: "[mask-image:linear-gradient(to_top,black_40%,transparent)]",
};

/**
 * A static grid of thin lines behind its content, like graph paper: one
 * SVG pattern, rasterised once, fills the box at any size and stays sharp
 * at any zoom. Cells can be filled and the lines dashed. Nothing runs in
 * the browser: it's a server component.
 *
 * @cssvar --grid-pattern-line The lines' colour (`var(--border)`).
 * @cssvar --grid-pattern-square The filled cells' colour (`var(--muted)`).
 */
export const GridPattern = (props: GridPatternProps) => {
  const {
    cellSize = 40,
    children,
    className,
    fade = "none",
    lineColor,
    squareColor,
    squares,
    strokeDasharray,
    ...rest
  } = props;
  const id = idOf(useId());
  const cells = cellsOf(cellSize, squares);

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      data-slot="grid-pattern"
      {...rest}
    >
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 size-full [content-visibility:auto]",
          FADE[fade]
        )}
        data-slot="grid-pattern-lines"
        style={
          {
            "--grid-pattern-line": lineColor,
            "--grid-pattern-square": squareColor,
          } as CSSProperties
        }
      >
        <defs>
          <pattern
            height={cellSize}
            id={id}
            patternUnits="userSpaceOnUse"
            width={cellSize}
            x={-1}
            y={-1}
          >
            <path
              className="[stroke:var(--grid-pattern-line,var(--border))]"
              d={`M.5 ${cellSize}V.5H${cellSize}`}
              fill="none"
              strokeDasharray={strokeDasharray}
            />
          </pattern>
        </defs>
        <rect fill={`url(#${id})`} height="100%" width="100%" />
        {cells.map((cell) => (
          <rect
            className="[fill:var(--grid-pattern-square,var(--muted))]"
            data-slot="grid-pattern-square"
            height={cellSize - 1}
            key={cell.key}
            width={cellSize - 1}
            x={cell.x}
            y={cell.y}
          />
        ))}
      </svg>
      {children}
    </div>
  );
};
