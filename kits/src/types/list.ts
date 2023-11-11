import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";

export type ListOperationOutput = OutputValues & {
	item: NodeValue;
	list: NodeValue[];
};

export type ListInput = InputValues & {
	list: NodeValue[];
};
export type ListOutput = OutputValues & {
	list: NodeValue[];
};

export type SplitListOutput = OutputValues & {
	before: NodeValue[];
	after: NodeValue[];
};

export type ListConcatInput = InputValues & {
	a: NodeValue[];
	b: NodeValue[];
};

export type ListIndexInput = InputValues & {
	list: NodeValue[];
	index: number;
};

export type ListItemInput = InputValues & {
	list: NodeValue[];
	item: NodeValue;
};

export type ListSpliceInput = InputValues & {
	list: NodeValue[];
	start: number;
	count: number;
	items?: NodeValue[];
};

export type ListSpliceOutput = OutputValues & {
	extracted: NodeValue[];
	list: NodeValue[];
};
