import subprocess
import sys
import os

def run_command(command, cwd=None, description=None):
    """Runs a shell command and prints status."""
    if description:
        print(f"\n[INFO] Starting: {description}...")
    
    try:
        # shell=True is required for npm commands on some systems to resolve PATH correctly
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            check=True, 
            stdout=sys.stdout,
            stderr=sys.stderr
        )
        print(f"[SUCCESS] {description} passed.")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[FAILURE] {description} failed with exit code {e.returncode}.")
        return False
    except Exception as e:
        print(f"[ERROR] An unexpected error occurred: {e}")
        return False

def main():
    print("========================================")
    print("      Rootify Automated Test Runner     ")
    print("========================================")
    
    # Define test suite
    # Each item is a dict with 'cmd', 'cwd', and 'desc'
    tests = [
        {
            "cmd": "npm run test:home",
            "cwd": "client",
            "desc": "Home Page Check"
        },
        {
            "cmd": "npm run test:nav",
            "cwd": "client",
            "desc": "Navigation Flow"
        },
        {
            "cmd": "npm run test:market",
            "cwd": "client",
            "desc": "Marketplace Load"
        },
        {
            "cmd": "npm run test:selenium",
            "cwd": "client",
            "desc": "Login/Signup Flow"
        }
    ]
    
    failed_tests = []
    
    for test in tests:
        success = run_command(test["cmd"], cwd=test["cwd"], description=test["desc"])
        if not success:
            failed_tests.append(test["desc"])
            
    print("\n========================================")
    print("              Test Summary              ")
    print("========================================")
    
    if failed_tests:
        print(f"❌ {len(failed_tests)} test(s) failed:")
        for name in failed_tests:
            print(f"   - {name}")
        sys.exit(1)
    else:
        print("✅ All tests passed successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
