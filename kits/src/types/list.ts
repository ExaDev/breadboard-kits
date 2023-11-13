import { InputValues, NodeValue, OutputValues } from "@google-labs/breadboard";

export type List = {
	list: NodeValue[];
};

export type Item = {
	item: NodeValue;
};

export type Index = {
	index: number;
};

export type ListOperationOutput = OutputValues & List & Item;

export type ListInput = InputValues & List;

export type ListOutput = OutputValues & List;

export type BifurcatedList = OutputValues & {
	before: NodeValue[];
	after: NodeValue[];
};

export type ListConcatInput = InputValues & {
	a: NodeValue[];
	b: NodeValue[];
};

export type ListIndexInput = InputValues & List & Index;

export type ListItemInput = InputValues & List & Item;

export type ListSpliceInput = InputValues &
	List & {
		start: number;
		count: number;
		items?: NodeValue[];
	};

export type ListSpliceOutput = OutputValues &
	List & {
		extracted: NodeValue[];
	};
