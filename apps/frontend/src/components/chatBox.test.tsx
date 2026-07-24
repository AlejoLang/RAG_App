import { describe, it, expect, vi, beforeEach } from "vitest";
import { ChatBox } from "./chatBox"
import { userEvent } from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { aiQuerry } from "../api/ai";

vi.mock('../api/ai', () => ({
  aiQuerry: vi.fn(),
}));

describe("ChatBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<ChatBox />);
    expect(container).toBeInTheDocument();
  });

  it("renders witouth intial messages", () => {
    render(<ChatBox />);
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    expect(screen.queryByText(/./)).toBeInTheDocument();
  });

  it("add user's message when the send button is clicked", async () => {
    vi.mocked(aiQuerry).mockResolvedValueOnce("Chat response");
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(aiQuerry).toHaveBeenCalledWith('Test message');
  });

  it("add user's message when the enter key is pressed", async () => {
    vi.mocked(aiQuerry).mockResolvedValueOnce("Chat response");
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Test message');
    user.click(screen.getByPlaceholderText('Type a message...'));
    await user.keyboard('{Enter}');

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(aiQuerry).toHaveBeenCalledWith('Test message');
  });

  it("clears the chat input after a message ahs been sent", async () => {
    vi.mocked(aiQuerry).mockResolvedValueOnce("Chat response");
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText('Type a message...') as HTMLInputElement;
    await user.type(input, 'Test message');
    user.click(screen.getByPlaceholderText('Type a message...'));
    await user.keyboard('{Enter}');

    expect(input.value).toBe('');
  });

  it("shows the ai response after the call", async () => {
    vi.mocked(aiQuerry).mockResolvedValueOnce("Chat response");
    const user = userEvent.setup();
    render(<ChatBox />);

    const input = screen.getByPlaceholderText('Type a message...');
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(await screen.findByText('Chat response')).toBeInTheDocument();
  });

  it("handles null user input on send", async () => {
    const user = userEvent.setup();
    const {container} = render(<ChatBox />);

    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(aiQuerry).not.toHaveBeenCalled();
    expect(container.querySelectorAll(".chat-message")).toHaveLength(0);
  });

  it('applies the correct CSS class to each message', async () => {
    vi.mocked(aiQuerry).mockResolvedValueOnce('Chat response');
    const user = userEvent.setup();
    render(<ChatBox />);

    await user.type(screen.getByPlaceholderText('Type a message...'), 'Test message');
    await user.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText('Test message').closest('.chat-message')).toHaveClass('user');
    const respuesta = await screen.findByText('Chat response');
    expect(respuesta.closest('.chat-message')).toHaveClass('assistant');
  });

});