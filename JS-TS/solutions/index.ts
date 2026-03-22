import { ToDoManager } from "./todo-manager";

async function main() {
    const manager = new ToDoManager();

    await manager.init();

    const [, , command, ...args] = process.argv;

    try {
        switch(command) {
            case 'list':
                const todos = await manager.list();
                console.log('\n--- TODO LIST ---');
                console.table(todos.map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.status
                })));
                break;

            case 'add':
                const [title, desc] = args;
                if (!title) {
                    console.log('Usage: add <title> [description]');
                } else {
                    await manager.add(title, desc || '');
                    console.log('Task added succesfully!');
                }
                break;

            case 'done':
                const id = parseInt(args[0], 10);
                if (isNaN(id)) {
                    console.log('Usage: done <id>');
                } else {
                    await manager.complete(id);
                    console.log(`Task ${id} updated!`);
                }
                break;

            default:
                console.log('Available commands: list, add, done');
                break;
        }
    } catch (error: any) {
        console.error('Error:', error);
    }
}

main();