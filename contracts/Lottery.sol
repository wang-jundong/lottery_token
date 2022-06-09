// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lottery is ERC721Enumerable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIds;
    address private admin;
    uint256 public totalTicket = 12;
    uint256 public maxTicketForUser = 5;
    uint256 public ticketPrice = 1;
    uint256[] public winners;
    uint256[] public winnersFee = [30, 15, 5, 5, 5];

    IERC20 babyQuint;
    uint256 tokenDecimals = 9;

    constructor(address _babyQuint) ERC721("Lottery", "Ticket") {
        admin = msg.sender;
        babyQuint = IERC20(_babyQuint);
    }

    modifier onlyOwner() {
        require(msg.sender == admin, "Only Admin can call");
        _;
    }

    modifier canBuyTicket(uint256 _ticketCount) {
        require(_ticketCount > 0, "Should buy at least one ticket");
        require(
            balanceOf(msg.sender).add(_ticketCount) <= maxTicketForUser,
            "Your ticket count is overflowed!"
        );
        require(
            _tokenIds.current().add(_ticketCount) <= totalTicket,
            "Ticket is not enough!"
        );
        _;
    }

    function buyTicket(uint256 _ticketCount)
        external
        canBuyTicket(_ticketCount)
    {
        sendBabyQuintToken(_ticketCount);
        for (uint256 i = 0; i < _ticketCount; i++) {
            _tokenIds.increment();
            _safeMint(msg.sender, _tokenIds.current());
        }
    }

    function lotteryResult() external onlyOwner {
        require(
            _tokenIds.current() == totalTicket,
            "All tickets should be sold"
        );

        setWinners();
        sendToWinners();
        burnAllTicket();
    }

    function sendBabyQuintToken(uint256 _ticketCount) private {
        babyQuint.transferFrom(
            msg.sender,
            address(this),
            ticketPrice.mul(_ticketCount).mul(10**tokenDecimals)
        );
    }

    function sendToWinners() private {
        uint256 balance = babyQuint.balanceOf(address(this));
        for (uint256 i = 0; i < 5; i++) {
            babyQuint.transfer(
                ownerOf(winners[i]),
                balance.mul(winnersFee[i]).div(100)
            );
        }
        balance = babyQuint.balanceOf(address(this));
        babyQuint.transfer(admin, balance);
    }

    function setWinners() private {
        delete winners;
        uint256 index = 0;
        while (winners.length < 5) {
            uint256 rand = uint256(
                keccak256(abi.encodePacked(block.timestamp.add(index)))
            );
            rand = (rand % totalTicket).add(1);
            index++;

            bool canAdd = true;
            for (uint256 i = 0; i < winners.length; i++) {
                if (rand == winners[i]) {
                    canAdd = false;
                    break;
                }
            }

            if (canAdd) {
                winners.push(rand);
            }
        }
    }

    function burnAllTicket() private {
        for (uint256 i = 1; i <= totalTicket; i++) {
            _burn(i);
        }
        _tokenIds.reset();
    }

    function getTicketRemain() external view returns (uint256) {
        return totalTicket.sub(_tokenIds.current());
    }

    function setTotalTicket(uint256 _totalTicket) external onlyOwner {
        totalTicket = _totalTicket;
    }

    function setMaxTicketForUser(uint256 _maxTicketForUser) external onlyOwner {
        maxTicketForUser = _maxTicketForUser;
    }

    function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
        ticketPrice = _ticketPrice;
    }

    function setWinnersFee(uint256[] memory _winnersFee) external onlyOwner {
        uint256 length = 5;
        if (_winnersFee.length < 5) length = _winnersFee.length;
        for (uint256 i = 0; i < length; i++) {
            winnersFee[i] = _winnersFee[i];
        }
    }
}
