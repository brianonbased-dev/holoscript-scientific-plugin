"""
HoloScript-Narupa Bridge
Python bridge for spawning and controlling Narupa servers
"""

import sys
import json
import argparse
from typing import Dict, Any


def start_narupa_server(config: Dict[str, Any]) -> None:
    """
    Start a Narupa server with the given configuration

    Args:
        config: Server configuration including pdb_path, port, etc.
    """
    # TODO: Implement Narupa server startup (Week 2)
    raise NotImplementedError("Week 2 implementation")


def handle_rpc_request(request: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle JSON-RPC request from HoloScript compiler

    Args:
        request: JSON-RPC request object

    Returns:
        JSON-RPC response object
    """
    method = request.get('method')
    params = request.get('params', {})

    if method == 'start_server':
        return {
            'jsonrpc': '2.0',
            'id': request.get('id'),
            'result': {'status': 'not_implemented'}
        }
    else:
        return {
            'jsonrpc': '2.0',
            'id': request.get('id'),
            'error': {'code': -32601, 'message': 'Method not found'}
        }


def main():
    """
    Main entry point for stdin/stdout JSON-RPC communication
    """
    parser = argparse.ArgumentParser(description='HoloScript-Narupa Bridge')
    parser.add_argument('--mode', choices=['rpc', 'test'], default='rpc',
                       help='Operation mode')
    args = parser.parse_args()

    if args.mode == 'test':
        print(json.dumps({'status': 'bridge_ready', 'version': '0.1.0'}))
        return

    # JSON-RPC loop
    for line in sys.stdin:
        try:
            request = json.loads(line.strip())
            response = handle_rpc_request(request)
            print(json.dumps(response), flush=True)
        except json.JSONDecodeError as e:
            error_response = {
                'jsonrpc': '2.0',
                'error': {'code': -32700, 'message': f'Parse error: {str(e)}'}
            }
            print(json.dumps(error_response), flush=True)


if __name__ == '__main__':
    main()
