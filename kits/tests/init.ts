import { Board } from "@google-labs/breadboard";
import ListKit from "../src/index.js";
import test from 'ava';

test('addKit', async (t) => {

  const board = new Board({
    title: "Exadev",
    description: "Exadev Breadboard Kit",
    version: "0.0.1",
  });
    
  const kit = board.addKit(ListKit);
  
  const query = board.input({
    $id: "input",
    schema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          title: "Echo",
          description: "What shall I say back to you?",
        },
      },
    },
  });
  
  query.wire("text->text", board.output())
  t.pass(); // Replies start with a space.
})